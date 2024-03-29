# cosmowebapp
[![CircleCI](https://circleci.com/gh/redshiftzero/cosmowebapp/tree/master.svg?style=svg&circle-token=5739fb2605ead621f315d9f5e64b55c57d6c4c0f)](https://circleci.com/gh/redshiftzero/cosmowebapp/tree/master)

Interactive cosmological power spectra using `d3.js`

## Developer Setup

```
git clone git@github.com:redshiftzero/cosmowebapp.git
cd cosmowebapp
python3 -m http.server
```

Now you can navigate to `localhost:8000` in your favorite browser and begin! Simply navigate to `localhost:8000/test/test.html` to run unit tests.

## Generating Data Using CAMB

0. [Download and install](http://camb.info/readme.html) CAMB.
1. Set `get_transfer = T` in `params.ini` so that the matter power spectrum is computed (by default it will be the linear power spectrum)
2. Run CAMB with `./camb params.ini`
