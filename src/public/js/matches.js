$(()=>{
    $.get('https://cricapi.com/api/matchCalendar?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2',(Data)=>{
        //console.log(data.matches);
        for(match of Data.data){
            if(match.unique_id=="will generate 1-2 days before match"){
                $('#matchList').append(`
                <div class="card shadow p-4 m-4 col-md-12"  >
                    <div class="card-header bg-transparent text-danger">${match.name}</div>
                    <div class="card-header bg-transparent text-primary">Will start on ${match.date}</div>

                </div>
                `)
            }
        }
        
    })
    
})
