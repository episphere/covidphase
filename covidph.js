console.log('covidph.js loaded')

covidph={
    date:Date()
}

covidph.getData = async (url='https://data.cdc.gov/resource/muzy-jte6.json?$limit=10000')=>{
    covidph.data = await (await fetch(url)).json()
    return covidph.data
}


if(typeof(define)!='undefined'){
    define(covidph)
}