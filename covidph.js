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

covidph.plotTime=async(state,selector,parm="covid_19_u071_underlying_cause_of_death",div)=>{
    div = div||document.createElement('div');
    if(!covidph.data){
        await covidph.getData()
    }
    let loc = state||"United States"
    let xx = covidph.data.filter((x) => x.jurisdiction_of_occurrence == loc);

    let trace = {
        x: xx.map((x) => x.week_ending_date),
        y: xx.map((x) => x[parm]),
        mode: 'lines+markers',
        marker: {
            color: 'rgba(17, 157, 255,0)',
            //size: 60,
            line: {
              color: 'navy',
              width: 1
            }
        },
        line: {
            //color:'lightblue'
            color:'rgba(100,100,100,0.2)'
        }

    };
    covidph.Plotly.newPlot(div, [trace],{
        title:`${loc}<br><span style="font-size:small">${parm}</span>`,
        xaxis:{
            showline: true,
            mirror: 'ticks',
            //autotick: true,
        },
        yaxis:{
            title:'weekly mortality',
            showline: true,
            mirror: 'ticks',
            rangemode:'tozero'
            //autotick: true,
        }
    });
    if(!state||selector){
        var sel = document.createElement('select')
        div.prepend(sel)
        var states = [... new Set(covidph.data.map(x=>x.jurisdiction_of_occurrence))]
        states.forEach(st=>{
            let opt = document.createElement('option')
            opt.value=opt.textContent=st
            sel.appendChild(opt)
        })
        if(state){sel.value=state}
        sel.onchange=_=>{
            //div.innerHTML=""
            delete div.querySelector('.plot-container')
            covidph.plotTime(sel.value,true,parm,div)
            sel.remove()
        }
    }
    return div;
}

if(typeof(define)!='undefined'){
    define(["https://cdn.plot.ly/plotly-latest.min.js"],function(Plotly){
        covidph.Plotly=Plotly
        return covidph
    })
}