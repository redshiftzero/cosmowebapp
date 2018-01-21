# cosmowebapp
[![CircleCI](https://circleci.com/gh/redshiftzero/cosmowebapp.svg?style=svg)](https://circleci.com/gh/redshiftzero/cosmowebapp)

Interactive cosmological power spectra using `d3.js`

## Developer Setup

```
git clone git@github.com:redshiftzero/cosmowebapp.git
cd cosmowebapp
python -m SimpleHTTPServer
```

Now you can navigate to `localhost:8000` in your favorite browser and begin! Simply navigate to `localhost:8000/test/test.html` to run unit tests.

## Generating Data Using CAMB

0. [Download and install](http://camb.info/readme.html) CAMB.
1. Set `get_transfer = T` in `params.ini` so that the matter power spectrum is computed (by default it will be the linear power spectrum)
2. Run CAMB with `./camb params.ini`
