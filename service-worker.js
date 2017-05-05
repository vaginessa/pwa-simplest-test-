var CACHE_VERSION = 'v0.1';
var CACHE = 'network-or-cache' + CACHE_VERSION;
var CACHE_FILES = [
    './',
    './index.html',
    './icon.png',
    './manifest.json'
];

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');

    evt.waitUntil(precache());
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
        return fromCache(evt.request);
    }));
});

function precache() {
    console.log('The service worker is pre-caching.');
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll(CACHE_FILES);
    });
}

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            console.log('Getting from "network" the following request:', request);
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            console.log('Getting from "cache" the following request:', request);
            return matching || Promise.reject('no-match');
        });
    });
}
