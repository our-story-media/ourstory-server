let fs = require('fs');
let _ = require('lodash');

let locales = ['en','es'];
let loaded = [];

for (let loc of locales)
{
    let loce = JSON.parse(fs.readFileSync(`${loc}.js`));
    loaded.push(loce);
    console.log(`Loaded ${loc}: ${_.size(loce)} Strings`);
}

let baseline = _.keys(loaded[0]);
// console.log(baseline)



for (let i=1;i<_.size(loaded);i++)
{
    // console.log(loaded[i])
    let matching = _.intersection(_.keys(loaded[i]),baseline);
    let notused = _.without(_.keys(loaded[i]),baseline);
    let existsonlyinbaseline = _.difference(baseline,_.keys(loaded[i]));
    console.log(`en terms missing from ${locales[i]}: ${_.size(baseline) - _.size(matching)}`);
    console.log(`superflous ${locales[i]} terms not in en: ${_.size(loaded[i]) - _.size(matching) - (_.size(baseline) - _.size(matching))}`)

    // console.log(existsonlyinbaseline);

    let used = {};
    for (let k of _.sortBy(_.union(matching,existsonlyinbaseline),0))
    {
        if (loaded[i][k])
            used[k] = loaded[i][k].trim();
        else
            used[k] = loaded[0][k].trim();
    }

    fs.writeFileSync(`${locales[i]}.sorted.js`, JSON.stringify(used,null,1));

    let possiblenotused = {};
    for (let k of _.sortBy(notused,0))
    {
        possiblenotused[k] = loaded[i][k].trim();
    }

    fs.writeFileSync(`${locales[i]}.notused.js`, JSON.stringify(possiblenotused,null,1));

}

let original = {};
for (let k of _.sortBy(baseline,0))
{
    original[k] = loaded[0][k];
}

fs.writeFileSync(`en.sorted.js`, JSON.stringify(original,null,1));