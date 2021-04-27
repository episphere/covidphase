console.log('covidph.js loaded')

covidph={
    date:Date()
}

covidph.pop=(aa,a)=>{ // remove a from aa
    if(!Array.isArray(a)){a=[a]}
    a.forEach(ai=>{
        aa=aa.filter(x=>x!=ai)
    })
    return aa
}

covidph.getData = async (url='https://data.cdc.gov/resource/muzy-jte6.json?$limit=10000')=>{
    covidph.data = await (await fetch(url)).json()
    //let dparm="week_ending_date"
    let parms=covidph.pop(Object.keys(covidph.data[0]),["jurisdiction_of_occurrence","week_ending_date"])


    covidph.data=covidph.data.map(x=>{
        parms.forEach(p=>{
            x[p]=parseInt(x[p])
        })
        x.week_ending_date=new Date(x.week_ending_date) // put date parm back
        return x
    })
    
    return covidph.data
}


if(typeof(define)!='undefined'){
    define(covidph)
}