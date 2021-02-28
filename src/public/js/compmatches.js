$(()=>{
    function getMatchDetails(match_id){
        return new Promise((resolve,reject)=>{
            $.get(`https://cricapi.com/api/cricketScore?apikey=RR3pOiNZnWUPzHL33mNRfTCSWL53&unique_id=${match_id}`,(data)=>{
                resolve(data);
            })
        })
    }
    $.get('https://cricapi.com/api/matchCalendar?apikey=RR3pOiNZnWUPzHL33mNRfTCSWL53',async(Data)=>{
        //console.log(data.matches);
        for(match of Data.data){
            if(match.unique_id!="will generate 1-2 days before match"){
                let matchDetails = await getMatchDetails(match.unique_id)
                $('#matchList').append(`
                <div class="card shadow p-4 m-4 col-md-12"  >
                    <div class="card-header bg-transparent text-danger">${match.name}</div>
                    <div class="card-header bg-transparent text-primary">Results : ${matchDetails.description}</div>

                </div>
                `)
            }
        }
        
    })
    
})
