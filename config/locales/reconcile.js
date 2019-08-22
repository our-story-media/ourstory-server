let fs = require('fs');
let _ = require('lodash');
const { Translate } = require('@google-cloud/translate');
const translate = new Translate();

let locales = ['en', 'es', 'fr','ar'];
let words = ['English','Español','Français','عربى'];

let loaded = [];

async function main() {

    for (let loc of locales) {
        let loce = JSON.parse(fs.readFileSync(`${loc}.js`));
        loaded.push(loce);
        console.log(`Loaded ${loc}: ${_.size(loce)} Strings`);
    }

    let baseline = _.keys(loaded[0]);
    // console.log(baseline)



    for (let i = 1; i < _.size(loaded); i++) {

        let matching = _.intersection(_.keys(loaded[i]), baseline);
        let notused = _.difference(_.keys(loaded[i]), baseline);
        let existsonlyinbaseline = _.difference(baseline, _.keys(loaded[i]));
        console.log(`en terms missing from ${locales[i]}: ${_.size(baseline) - _.size(matching)}`);
        console.log(`superflous ${locales[i]} terms not in en: ${_.size(loaded[i]) - _.size(matching) - (_.size(baseline) - _.size(matching))}`)

        // console.log(existsonlyinbaseline);

        let used = {};
        for (let k of _.sortBy(matching, 0)) {
            if (loaded[i][k])
                used[k] = loaded[i][k].trim();
            else
                used[k] = loaded[0][k].trim();
        }

        console.log(words[0]);
        used['en'] = words[0];
        used['es'] = words[1];
        used['fr'] = words[2];
        used['ar'] = words[3];

        fs.writeFileSync(`${locales[i]}.sorted.js`, JSON.stringify(used, null, 1));

        let possiblenotused = {};
        for (let k of _.sortBy(notused, 0)) {
            possiblenotused[k] = loaded[i][k].trim();
        }

        fs.writeFileSync(`${locales[i]}.notused.js`, JSON.stringify(possiblenotused, null, 1));

        let existsonlyinbaselinearr = {};
        for (let k of _.sortBy(existsonlyinbaseline, 0)) {
            existsonlyinbaselinearr[k] = loaded[0][k].trim();
        }

        fs.writeFileSync(`${locales[i]}.totranslate.js`, JSON.stringify(existsonlyinbaselinearr, null, 1));

        //do translation:
        let translated = {};
        for (let k of _.sortBy(existsonlyinbaseline, 0)) {
            let totranslate = loaded[0][k].trim();
            let [translation] = await translate.translate(totranslate, locales[i]);
            console.log(`Translated ${totranslate} into ${locales[i]}: ${translation}`);
            translated[k] = translation;
        }

        fs.writeFileSync(`${locales[i]}.translated.js`, JSON.stringify(translated, null, 1));
    }

    let original = {};
    for (let k of _.sortBy(baseline, 0)) {
        original[k] = loaded[0][k];
    }
    original['en'] = words[0];
    original['es'] = words[1];
    original['fr'] = words[2];
    original['ar'] = words[3];


    fs.writeFileSync(`en.sorted.js`, JSON.stringify(original, null, 1));

}

main();
