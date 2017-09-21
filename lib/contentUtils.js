function simplifyFields(valueObject) {
  var values = new Map(Object.entries(valueObject));

  let simpleValues = {};

  values.forEach((item, key, mapObj) => {
    let valueKey = Object.keys(item.value)[0];
    simpleValues[item.fieldDefIdentifier] = item.value[valueKey];
  });

  return simpleValues;
}

export { simplifyFields };
