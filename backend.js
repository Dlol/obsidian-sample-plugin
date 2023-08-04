const { request } = require('obsidian')

const toLoad = ["character", "world", "prompt", "plot"]

function loadConfig(filename) {
    const yaml = require('js-yaml')
    const fs = require("fs")
    return yaml.load(fs.readFileSync(filename, "utf-8"))
}

async function updateQuestions(config) {
    let outData = {}

    let base = `https://docs.google.com/spreadsheets/d/${config.sheetsId}/export?gid=`
    for (const key in config.sheets) {
        let url = base + config.sheets[key] + "&format=csv"
        console.log(`Fetching ${key}.csv! {${url}}`);
        const body = await request(url)
        outData[key] = body
    }
    console.log("questions updated");
    return outData
}

function questionInit(data) {
    const {parse} = require('csv/sync');
    let cats = {}

    let loaded = {}
    // console.log(data["plot"]);
    for (const item of toLoad) {
        // console.log(`Item: ${item}, data: ${data[item]}`);
        const records = parse(data[item], {from:1})
        console.log(records);
        let obj = []
        for (const record of records) {
            obj.push([])
            for (const sub of record) {
                if (sub == "") {continue}
                obj.at(-1).push(sub)
            }
        }
        loaded[item] = obj
    }
    
    const categoryRecords = parse(data.categories, {
        from: 2,
        relax_column_count: true
    })

    let currentType = ""
    for (const item of categoryRecords) {
        // console.log(item);
        if (item[2] == "") {
            let type = item.shift()
            switch (type) {
                case "World Questions":
                    currentType = "world"
                    break;
                
                case "Character Questions":
                    currentType = "character"
                    break;
                
                case "Writing Prompts":
                    currentType = "prompt"
                    break;

                case "Plot Questions":
                    currentType = "plot"
                    break;
            
                default:
                    // throw "fuck shit"
            }
            continue
        }
        let category = item.shift()
        if (category == "") {
            category = item.shift()
        }
        else { item.shift() }
        let desc = item.shift()
        if (cats[currentType]) {
            cats[currentType][category] = desc
        }
        else {
            cats[currentType] = {}
            cats[currentType][category] = desc
        }
    }
    console.log("questions init");
    // console.log(cats);
    return {...loaded, cats}
}

function arrayChoose(array) {
    const idx = Math.floor(Math.random() * array.length)
    // console.log(idx)
    return array[idx]
}

function thingPicker(questions, filters) {
    if (!filters) {
        return arrayChoose(questions)
    }
    if (filters[0] == "") {
        return arrayChoose(questions)
    }
    let pos = []
    let neg = []
    for (const filter of filters) {
        if (filter.at(0) == "-") {neg.push(filter.slice(1))}
        else { pos.push(filter) }
    }
    let filteredQs = []
    outer: for (const item of questions) {
        for (const negFilter of neg) {
            if (item.includes(negFilter)) {
                continue outer
            }
        }
        if (pos.length < 1) {
            filteredQs.push(item)
        }
        let results = []
        for (const posFilter of pos) {
            results.push(item.includes(posFilter))
        }
        if (results.every((val) => val)) {
            filteredQs.push(item)
        }
    }
    return arrayChoose(filteredQs)
}

module.exports = {
    loadConfig,
    updateQuestions,
    questionInit,
    thingPicker,
    toLoad
}