export const DictionaryToArray = (dataDictionary) => {
    return Object.keys(dataDictionary).reduce((pre, item)=>{
        pre.push(dataDictionary[item]);
        return pre;
    }, [])
}

export const ArrayToDictionary = (dataArray) => {
    return dataArray.reduce((dictionary, item) => {
        dictionary[item.id] = item;
        return dictionary
    }, {})
}