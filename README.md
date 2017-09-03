# cosmowebapp
cosmology webapp

## Developer Setup

```
git clone git@github.com:redshiftzero/cosmowebapp.git
cd cosmowebapp
python -m SimpleHTTPServer
```

Now you can navigate to `localhost:8000` in your favorite browser and begin!

## Generating Data Using CAMB

0. [Download and install](http://camb.info/readme.html) CAMB.
1. Set `get_transfer = T` in `params.ini` so that the matter power spectrum is computed (by default it will be the linear power spectrum)
2. Run CAMB with `./camb params.ini`
