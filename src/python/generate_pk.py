import numpy as np
import camb
from camb import model, initialpower
import pdb

import matplotlib.pyplot as pl

def get_pk_cell(params):
    #Set up a new set of parameters for CAMB
    pars = camb.CAMBparams()
    #This function sets up CosmoMC-like settings, with one massive neutrino and helium set using BBN consistency
    #pars.set_cosmology(H0=67.5, ombh2=0.022, omch2=0.122, mnu=0.06, omk=0, tau=0.06)
    pars.set_cosmology(H0=params['H0'], ombh2=params['ombh2'], omch2=params['omch2'], mnu=0.06, omk=params['omk'], tau=params['tau'])
    pars.InitPower.set_params(As=params['As'], ns=params['ns'], r=0)
    pars.set_for_lmax(2500, lens_potential_accuracy=0)
    
    #calculate results for these parameters
    results = camb.get_results(pars)
    
    #get dictionary of CAMB power spectra
    powers =results.get_cmb_power_spectra(pars, CMB_unit='muK')
    #for name in powers: print(name)
    tdata = powers['total']
    ell = np.arange(0,tdata.shape[0])
    cell = tdata[:,0]
    
    #Now get matter power spectra and sigma8 at redshift 0 and 0.8
    pars.set_dark_energy() #re-set defaults
    #Not non-linear corrections couples to smaller scales than you want
    pars.set_matter_power(redshifts=[0.], kmax=2.0)
    
    #Linear spectra
    pars.NonLinear = model.NonLinear_none
    results = camb.get_results(pars)
    kh, z, pk = results.get_matter_power_spectrum(minkh=1e-4, maxkh=1, npoints = 200)
    s8 = np.array(results.get_sigma8())
    
    #Non-Linear spectra (Halofit)
    pars.NonLinear = model.NonLinear_both
    results.calc_power_spectra(pars)
    kh_nonlin, z_nonlin, pk_nonlin = results.get_matter_power_spectrum(minkh=1e-4, maxkh=1, npoints = 200)

    if (0):
        fig, ax = pl.subplots(1,1)
        ax.plot(kh_nonlin, pk_nonlin[0,:])
        ax.set_xscale('log')
        ax.set_yscale('log')
        pdb.set_trace()

    return kh_nonlin, pk_nonlin, ell, cell, s8


fiducial_model = {'H0':70., 'ombh2':0.022, 'omch2':0.122, 'omk':0., 'ns':0.96, 'As':2e-09, 'tau':0.06}    
model_type = 'fiducial' #fiducial or fixomch2
param_name = 'h'

if (param_name == 'om'):
    min_val = 0.1
    max_val = 1.0
    num_val = 10
    param_list = np.linspace(min_val, max_val, num = num_val)
if (param_name == 'h'):
    min_val = 0.5
    max_val = 1.0
    num_val = 10
    param_list = np.linspace(min_val, max_val, num = num_val)
if (param_name == 'omch2'):
    min_val = 0.01
    max_val = 0.5
    num_val = 10
    param_list = np.linspace(min_val, max_val, num = num_val)


for pi in xrange(0,len(param_list)):
    print "pi = ", pi
    
    this_model = dict(fiducial_model)
    #Don't fix Omega_Mh^2
    if model_type == 'fiducial':
        if (param_name == 'om'):
            om = param_list[pi]
            omh2 = om*(fiducial_model['H0']/100.)**2.
            this_model['omch2'] = omh2
        if (param_name == 'omch2'):
            omh2 = param_list[pi]
            this_model['omch2'] = omh2
        if (param_name == 'h'):
            h = param_list[pi]
            H0 = 100.*h
            this_model['H0'] = H0
    #Fix Omega_Mh^2
    if model_type == 'fixomch2':
        if (param_name == 'om'):
            om = param_list[pi]
            H0 = 100.*np.sqrt(fiducial_model['omch2']/om)
            this_model['H0'] = H0
        if (param_name == 'h'):
            h = param_list[pi]
            H0 = 100.*h
            this_model['H0'] = H0

    kk, pk, ell, cell, s8 = get_pk_cell(this_model)

    if (pi == 0):
        kk_total = np.copy(kk)
        pk_total = np.copy(pk)
        ell_total = np.copy(ell)
        cell_total = np.copy(cell)
        s8_total = np.array([s8])
    if (pi > 0):
        pk_total = np.vstack((pk_total, pk))
        cell_total = np.vstack((cell_total, cell))
        s8_total = np.append(s8_total, s8)
        

#Output P(k) and C(ell)
dir = '../../data/'
filename_pk = 'pk_modeltype_' + model_type + '_param_' + param_name + '.txt'
filename_cell = 'cl_modeltype_' + model_type + '_param_' + param_name + '.txt'

#Output P(k) to file
header1 = '# First row is parameter values (first value is 99.0)'
header2 = '# Second row is sigma_8 (first value is 99.0)'
header3 = '# First column is k (Mpc/h), second column is P(k,z =0)'
header4 = '# parmeter being varied is ' + param_name
header5 = '# model type = ' + model_type
header = header1 + '\n' + header2 + '\n' + header3 + '\n' + header4 + '\n' + header5

output_data1 = np.vstack((kk_total, pk_total)).transpose()
row1 = np.append(99.0, param_list)
row2 = np.append(99.0, s8_total)
output_data = np.vstack((row1, row2, output_data1))
np.savetxt(dir + filename_pk, output_data, header = header)

#Output C(ell) to file
header1 = '# First row is parameter values (first value is 99.0)'
header2 = '# Second row is sigma_8 (first value is 99.0)'
header3 = '# First column is ell, second column is C(ell)'
header4 = '# parmeter being varied is ' + param_name
header5 = '# model type = ' + model_type
header = header1 + '\n' + header2 + '\n' + header3 + '\n' + header4 + '\n' + header5

output_data1 = np.vstack((ell_total, cell_total)).transpose()
row1 = np.append(99.0, param_list)
row2 = np.append(99.0, s8_total)
output_data = np.vstack((row1, row2, output_data1))
np.savetxt(dir + filename_cell, output_data, header = header)


    
pdb.set_trace()
