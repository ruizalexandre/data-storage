function DataStorage(parameters) {
  var _key = parameters && parameters.key || 'root';
  var _subscribers = {};
  var _storageByKeys = {};
  var _lastSubscriberId = 0;
  var _state = parameters && parameters.initialState || {};
  var _syncWithStorage = parameters && parameters.syncWithStorage || undefined;

  if (_syncWithStorage) {
    var fromStorage = JSON.parse(_syncWithStorage.getItem('DataStorage__' + _key));
    if (fromStorage) {
      _state = fromStorage;
    }
  }

  function _performSyncWithStorage() {
    if (_syncWithStorage) {
      var key = 'DataStorage__' + _key;
      _syncWithStorage.removeItem(key);
      _syncWithStorage.setItem(key, JSON.stringify(_state));
    }
  }

  function _freezeState(state) {
    return Object.freeze(state);
  }

  function _getData(configuration) {
    if (configuration && configuration.populate) {
      var populatedState = {
        ..._freezeState(_state),
      };

      Object.keys(_storageByKeys).forEach(function (storageKey) {
        populatedState = {
          ...populatedState,
          [_storageByKeys[storageKey].key]: _storageByKeys[storageKey].getData(),
        }
      });

      return populatedState;
    }

    return _freezeState(_state);
  }

  function _appendStorage(dataStorage) {
    if (_storageByKeys[dataStorage.key]) {
      throw '[DataStorage::append] A DataStorage with the key' + dataStorage.key + ' already exists';
    }
    _storageByKeys[dataStorage.key] = dataStorage;
  }

  function _setData(newState, replace) {
    if (newState instanceof Function) {
      _state = replace
        ? newState(_getData())
        : Object.assign({}, _state, newState(_getData()));
    } else {
      _state = replace
        ? newState
        : Object.assign({}, _state, newState);
    }

    Object.keys(_subscribers).forEach(function (subKey) {
      _subscribers[subKey](_freezeState(_state));
    });

    _performSyncWithStorage();
  }

  function _selectData(selector) {
    if (selector instanceof Function) {
      return selector(_getData());
    } else {
      return _getData()[selector];
    }
  }

  function _selectStorage(key) {
    return _storageByKeys[key];
  }

  function _subscribe(callback) {
    var currentId = _lastSubscriberId++;
    _subscribers[currentId] = callback;
    callback(_getData());

    return {
      id: 'DataStorage_' + _key + '_subscriber_' + currentId,
      unsubscribe: function () {
        delete _subscribers[currentId];
        return true;
      }
    };
  }

  _performSyncWithStorage();

  return {
    key: _key,
    appendStorage: _appendStorage,
    setData: _setData,
    getData: _getData,
    selectData: _selectData,
    selectStorage: _selectStorage,
    subscribe: _subscribe,
  }
}
