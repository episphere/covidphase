console.log('covidph.js loaded');

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

covidph.getScript=async (url="https://cdn.plot.ly/plotly-latest.min.js")=>{
    return new Promise((resolve,reject)=>{
        console.log('loading ',url)
        let s = document.createElement('script')
        s.src=url
        s.onload=resolve
        s.onerror=reject
        document.head.appendChild(s)
    });
}

(async()=>{
    await covidph.getScript("https://cdn.plot.ly/plotly-latest.min.js")
    if(typeof(Plotly)!='undefined'){
        //console.log('type:',typeof(Plotly));
        covidph.Plotly=Plotly
    }  
})()

covidph.plot=(x,y)=>{
    let div = document.createElement('div');
    let trace = {
        x: x||[1, 2, 3, 4, 5, 6],
        y: y||[4, 3, 2, 5, 3, 4]
    };
    covidph.Plotly.newPlot(div, [trace]);
    return div;
}

if(typeof(define)!='undefined'){
    define(["https://cdn.plot.ly/plotly-latest.min.js"],function(Plotly){
        covidph.Plotly=Plotly
        return covidph
    })
}