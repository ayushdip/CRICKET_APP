$(()=>{
    async function getPlayerDetails(pid){
        return new Promise(async(resolve,reject)=>{
            await $.get(`https://cricapi.com/api/playerStats?apikey=RR3pOiNZnWUPzHL33mNRfTCSWL53&pid=${pid}`,(data)=>{
                if(data){
                    resolve(data);
                }
                else{
                    reject(new Error("Not able to find player"));
                }
            })
        })
    }
    $('#btnSearch').click(()=>{
        
        let name = $('#pname').val();
        let dummyJson = {
            Mat : 0,
            Inns : 0,
            "50" : 0,
            "100" : 0,
            Runs : 0,
            BF : 0,
            HS : 0,
            NO : 0,
            Ave : 0,
            SR : 0,
            "4s" : 0,
            "6s" : 0

        }
        $.get(`https://cricapi.com/api/playerFinder?apikey=RR3pOiNZnWUPzHL33mNRfTCSWL53&name=${name}`,async(found)=>{
            let players = found.data;
            $('#playerInfo').empty();
            for(player of players){
                let data = await getPlayerDetails(player.pid);
                console.log(data);
                let batdataTest = data.data.batting.tests ? data.data.batting.tests : dummyJson;
                let batdataODI = data.data.batting.ODIs ? data.data.batting.ODIs : dummyJson;;
                let batdataT20 = data.data.batting.T20Is ? data.data.batting.T20Is : dummyJson;;
                let batdatafirstclass = data.data.batting.firstClass ? data.data.batting.firstClass : dummyJson;;
                let batadatalistA = data.data.batting.listA ? data.data.batting.listA : dummyJson;;
                console.log(batdataT20);
                await $('#playerInfo').append(`
                <div class="card shadow m-md-4">
                    <img src=${data.imageURL} class="card-img-top mx-auto rounded-circle" style="height:200px;width:200px;" alt="Image loading failed">
                    <div class="card-body">
                        <h5 class="card-title heading">${data.fullName}</h5>
                        <h6 class="card-subtitle text-center my-4" style="font-size:20px;"><b>${data.playingRole}</b></h6>
                        <p class="card-text">${data.profile}</p>
                       
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item text-center bg-dark" style="color:white;">Personal Information</li>
                        <li class="list-group-item text-center">Born : ${data.born}</li>
                        <li class="list-group-item text-center">Country : ${data.country}</li>
                        <li class="list-group-item text-center">Age : ${data.currentAge}</li>
                        <li class="list-group-item text-center">Batting Style : ${data.battingStyle}</li>
                        <li class="list-group-item text-center">Bowling Style : ${data.bowlingStyle}</li>
                        <li class="list-group-item text-center">Teams : ${data.majorTeams}</li>
                        <li class="list-group-item text-center bg-dark" style="color:white;">Batting Carrier</li>
                        <table class="table table-responsive-md">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Test</th>
                                    <th scope="col">ODI</th>
                                    <th scope="col">T20</th>
                                    <th scope="col">First Class</th>
                                    <th scope="col">list A</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">Matches</th>
                                    <td>${batdataTest.Mat}</td>
                                    <td>${batdataODI.Mat}</td>
                                    <td>${batdataT20.Mat}</td>
                                    <td>${batdatafirstclass.Mat}</td>
                                    <td>${batadatalistA.Mat}</td>
                                </tr>
                                <tr>
                                <th scope="row">Innings</th>
                                    <td>${batdataTest.Inns}</td>
                                    <td>${batdataODI.Inns}</td>
                                    <td>${batdataT20.Inns}</td>
                                    <td>${batdatafirstclass.Inns}</td>
                                    <td>${batadatalistA.Inns}</td>
                                </tr>
                                <tr>
                                <th scope="row">Runs</th>
                                    <td>${batdataTest.Runs}</td>
                                    <td>${batdataODI.Runs}</td>
                                    <td>${batdataT20.Runs}</td>
                                    <td>${batdatafirstclass.Runs}</td>
                                    <td>${batadatalistA.Runs}</td>
                                </tr>
                                <tr>
                                <th scope="row">Balls</th>
                                    <td>${batdataTest.BF}</td>
                                    <td>${batdataODI.BF}</td>
                                    <td>${batdataT20.BF}</td>
                                    <td>${batdatafirstclass.BF}</td>
                                    <td>${batadatalistA.BF}</td>
                                </tr>
                                <tr>
                                <th scope="row">Highest Score</th>
                                    <td>${batdataTest.HS}</td>
                                    <td>${batdataODI.HS}</td>
                                    <td>${batdataT20.HS}</td>
                                    <td>${batdatafirstclass.HS}</td>
                                    <td>${batadatalistA.HS}</td>
                                </tr>
                                <tr>
                                <th scope="row">Highest Score</th>
                                    <td>${batdataTest.Ave}</td>
                                    <td>${batdataODI.Ave}</td>
                                    <td>${batdataT20.Ave}</td>
                                    <td>${batdatafirstclass.Ave}</td>
                                    <td>${batadatalistA.Ave}</td>
                                </tr>
                                <tr>
                                <th scope="row">Strike Rate</th>
                                    <td>${batdataTest.SR}</td>
                                    <td>${batdataODI.SR}</td>
                                    <td>${batdataT20.SR}</td>
                                    <td>${batdatafirstclass.SR}</td>
                                    <td>${batadatalistA.SR}</td>
                                </tr>
                                <tr>
                                <th scope="row">Not Out</th>
                                    <td>${batdataTest.NO}</td>
                                    <td>${batdataODI.NO}</td>
                                    <td>${batdataT20.NO}</td>
                                    <td>${batdatafirstclass.NO}</td>
                                    <td>${batadatalistA.NO}</td>
                                </tr>
                                <tr>
                                <th scope="row">Fours</th>
                                    <td>${batdataTest["4s"]}</td>
                                    <td>${batdataODI["4s"]}</td>
                                    <td>${batdataT20["4s"]}</td>
                                    <td>${batdatafirstclass["4s"]}</td>
                                    <td>${batadatalistA["4s"]}</td>
                                </tr>
                                <tr>
                                <th scope="row">Sixes</th>
                                    <td>${batdataTest["6s"]}</td>
                                    <td>${batdataODI["6s"]}</td>
                                    <td>${batdataT20["6s"]}</td>
                                    <td>${batdatafirstclass["6s"]}</td>
                                    <td>${batadatalistA["6s"]}</td>
                                </tr>
                                <tr>
                                <th scope="row">50s</th>
                                    <td>${batdataTest["50"]}</td>
                                    <td>${batdataODI["50"]}</td>
                                    <td>${batdataT20["50"]}</td>
                                    <td>${batdatafirstclass["50"]}</td>
                                    <td>${batadatalistA["50"]}</td>
                                </tr>
                                <tr>
                                <th scope="row">100s</th>
                                    <td>${batdataTest["100"]}</td>
                                    <td>${batdataODI["100"]}</td>
                                    <td>${batdataT20["100"]}</td>
                                    <td>${batdatafirstclass["100"]}</td>
                                    <td>${batadatalistA["100"]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>
                `)
            }
        })
        
    })
    
})