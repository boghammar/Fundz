# Fundz
This is an experimental system for handling stock fund strategies based on simple SMA analysis. The idea is from a thread at FlashBack where different fund strategies are discussed.

The application is a Node.js based application built around Express with Pug as view template engine. It gets the fund daily quotes from the inofficial Avanza API's that has been gracefully reversengineered by the guy in the FlashBack thread.

## Install
1. Clone repository somewhere
2. Run ``npm install`` inside the ``./Fundz/`` folder

## Update
1. Run ``git pull`` inside ``../Fundz/`` folder.
2. Run ``npm install`` inside ``../Fundz/`` folder

## Configuration
Configuration is located in the file ``config.js`` in the root directory. It has the following format:
```
var config = {
    fundids: [1933, 2801, 482298, 181108], // An array of fundids
    smas: 6,10,         //a list of simple moving averages that shall be calculated unit is in months
    debug: false,       // if true extra debugging is done to the console
}

module.exports = config;
```


## Find a fund ID
It's easy to find a fund id, just browse the [Avanza fundlist](https://www.avanza.se/fonder/lista.html) and check the url's to the fund pages. E.g the url to "SEB Råvaror Indexfond" is https://www.avanza.se/fonder/om-fonden.html/482298/seb-ravaror-indexfond hence the id is 482298.

## Screenshoots

