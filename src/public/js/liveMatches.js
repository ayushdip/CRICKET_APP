$(()=>{
    let matchD = {};
    let matchS = {};
    async function getPlayerDetails(pid){
        return new Promise(async(resolve,reject)=>{
            await $.get(`https://cricapi.com/api/playerStats?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2&pid=${pid}`,(data)=>{
                if(data){
                    resolve(data);
                }
                else{
                    reject(new Error("Not able to find player"));
                }
            })
        })
    }
    function getMatchDetails(match_id){
        return new Promise((resolve,reject)=>{
            if(matchD[match_id]){
                console.log("YO man")
                resolve(matchD[match_id]);
            }
            else{
                $.get(`https://cricapi.com/api/fantasySummary?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2&unique_id=${match_id}`,(data)=>{
                    matchD[match_id] = data;
                    console.log(matchD);
                    resolve(data);
                })
            }
        })
    }
    function getMatchScore(match_id){
        return new Promise((resolve,reject)=>{
            if(matchS[match_id]){
                resolve(matchS[match_id]);
            }
            else{
                $.get(`https://cricapi.com/api/cricketScore?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2&unique_id=${match_id}`,(data)=>{
                    matchS[match_id] = data;
                    resolve(data);
                })
            }
        })
    }
    $.get('https://cricapi.com/api/cricket?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2',async(Data)=>{
        //console.log(data.matches);
        for(match of Data.data){
            let matchDetails = await getMatchDetails(match.unique_id);
            let matchScore = await getMatchScore(match.unique_id);
            console.log(matchScore);
            let team1 = matchScore["team-1"];
            let team2 = matchScore["team-2"];
            let toss_winner = matchDetails.data.toss_winner_team
            let curr_score = matchScore.description.split('v');
            let team1_score = curr_score[0] 
            let team2_score = curr_score[1];
            let score = matchDetails.data;
            let batTeams = score.batting;
            let bowlTeams = score.bowling;
            console.log(matchDetails);
            if(matchScore.matchStarted && toss_winner){
                $('#liveList').append(`
                    <div class="card shadow p-4 m-4 col-md-12"  >
                        <div class="card-header bg-transparent text-danger">${team1} vs ${team2}</div>
                        <div class="card-header bg-transparent text-primary">${team1_score}<br>${team2_score}</div>
                        <div class="card-header bg-transparent text-success">${toss_winner} won the toss</div>
                        <button class="btn btn-primary" data-components="${match.unique_id}">View details</button>
                    </div>
                `)
            }
        }
        $('.btn').click((ev)=>{
            let unique_id = $(ev.target).attr('data-components');
            console.log(unique_id);
            $('#content').load('/components/matchScore.html',async()=>{
                let matchDetails = await getMatchDetails(unique_id);
                let matchScore = await getMatchScore(unique_id);
                let team1 = matchScore["team-1"];
                let team2 = matchScore["team-2"];
                let toss_winner = matchDetails.data.toss_winner_team;
                let curr_score = matchScore.description.split('v');
                let team1_score = curr_score[0] 
                let team2_score = curr_score[1];
                let score = matchDetails.data;
                let teams = matchDetails.data.team;
                let batTeams = score.batting;
                let bowlTeams = score.bowling;
                $('#head').text(`${team1} vs ${team2}`);
                let i=0;
                $('#teamScores').append(`
                    <div class="card shadow mx-auto p-4 col-md-6"  >
                        <div class="card-header bg-transparent text-danger">${team1} vs ${team2}</div>
                        <div class="card-header bg-transparent text-primary">${team1_score}<br>${team2_score}</div>
                        <div class="card-header bg-transparent text-success">${toss_winner} won the toss</div>
                    </div>
                `)
                for(team of batTeams){
                    $('#scoreList').append(`<li class="list-group-item text-center bg-dark" style="color:white;">${team.title}</li>`)
                    $('#scoreList').append(`
                    <table class="table table-responsive-md">
                        <thead>
                            <tr>
                                <th scope="col">Batsman</th>
                                <th scope="col">Dismissal</th>
                                <th scope="col">Runs</th>
                                <th scope="col">Balls</th>
                                <th scope="col">4s</th>
                                <th scope="col">6s</th>
                                <th scope="col">Strike Rate</th>
                            </tr>
                        </thead>
                        <tbody id="bTable${i}">
                        </tbody>
                    </table>`)
                    console.log(team.scores);
                    for(batsman of team.scores){
                        //console.log(batsman);
                        $(`#bTable${i}`).append(`
                        <tr>
                            <td class="playerPID" data-components=${batsman.pid} style="color:blue;cursor:pointer;">${batsman.batsman}</td>
                            <td>${batsman["dismissal-info"]}</td>
                            <td>${batsman.R}</td>
                            <td>${batsman.B}</td>
                            <td>${batsman["4s"]}</td>
                            <td>${batsman["6s"]}</td>
                            <td>${batsman.SR}</td>
                        </tr>
                        `
                        )
                    }
                    let bowling = bowlTeams[i];
                    $('#scoreList').append(`<li class="list-group-item text-center bg-dark" style="color:white;">${bowling.title}</li>`)
                    $('#scoreList').append(`
                    <table class="table table-responsive-md">
                        <thead>
                            <tr>
                                <th scope="col">Bowler</th>
                                <th scope="col">Overs</th>
                                <th scope="col">Maidens</th>
                                <th scope="col">Runs</th>
                                <th scope="col">Wickets</th>
                                <th scope="col">Economy</th>
                            </tr>
                        </thead>
                        <tbody id="bowlTable${i}">
                        </tbody>
                    </table>`)
                    console.log(bowling.scores);
                    for(bowler of bowling.scores){
                        //console.log(batsman);
                        $(`#bowlTable${i}`).append(`
                        <tr>
                            <td class="playerPID" data-components=${bowler.pid} style="color:blue;cursor:pointer;">${bowler.bowler}</td>
                            <td>${bowler.O}</td>
                            <td>${bowler.M}</td>
                            <td>${bowler.R}</td>
                            <td>${bowler.W}</td>
                            <td>${bowler.Econ}</td>
                            
                        </tr>
                        `
                        )
                    }
                    i++;
                }
                // Add squads of both teams
                for(team_squad of teams){
                    $('#scoreList').append(`<li class="list-group-item text-center bg-dark" style="color:white;">${team_squad.name}</li>`)
                    let players_squad = team_squad.players;
                    let full_team = "";
                    for(player of players_squad)
                        full_team += player.name + ', '
                    console.log(full_team);
                    $('#scoreList').append(`<li class="list-group-item text-center">${full_team}</li>`)
                }
                $('.playerPID').click(async(ev)=>{
                    //console.log("clicked");
                    console.log($(ev.target));
                    let pid = $(ev.target).attr('data-components');
                    let data = await getPlayerDetails(pid);
                    $('#content').load('/components/playFind.html',()=>{
                        $('#formFill').hide();
                        let dummyJson1 = {
                            "10" : 0,
                            "5w" : 0,
                            "4w" : 0,
                            SR : 0,
                            Econ : 0,
                            Ave : 0,
                            BBM : 0,
                            BBI : 0,
                            Wkts : 0,
                            Runs : 0,
                            Balls : 0,
                            Inns : 0,
                            Mat : 0
                        }
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
                        let batdataTest = data.data.batting.tests ? data.data.batting.tests : dummyJson;
                        let batdataODI = data.data.batting.ODIs ? data.data.batting.ODIs : dummyJson;
                        let batdataT20 = data.data.batting.T20Is ? data.data.batting.T20Is : dummyJson;
                        let batdatafirstclass = data.data.batting.firstClass ? data.data.batting.firstClass : dummyJson;
                        let batadatalistA = data.data.batting.listA ? data.data.batting.listA : dummyJson;
                        let bowldataTest = data.data.bowling.tests ? data.data.bowling.tests : dummyJson1;
                        let bowldataODI = data.data.bowling.ODIs ? data.data.bowling.ODIs : dummyJson1;
                        let bowldataT20 = data.data.bowling.T20Is ? data.data.bowling.T20Is : dummyJson1;
                        let bowldatafirstclass = data.data.bowling.firstClass ? data.data.bowling.firstClass : dummyJson1;
                        let bowldatalistA = data.data.bowling.listA ? data.data.bowling.listA : dummyJson1;
                        
                        console.log(batdataT20);
                        $('#playerInfo').append(`
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
                                        <th scope="row">Average</th>
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
                                <li class="list-group-item text-center bg-dark" style="color:white;">Bowling Carrier</li>
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
                                            <td>${bowldataTest.Mat}</td>
                                            <td>${bowldataODI.Mat}</td>
                                            <td>${bowldataT20.Mat}</td>
                                            <td>${bowldatafirstclass.Mat}</td>
                                            <td>${bowldatalistA.Mat}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Innings</th>
                                            <td>${bowldataTest.Inns}</td>
                                            <td>${bowldataODI.Inns}</td>
                                            <td>${bowldataT20.Inns}</td>
                                            <td>${bowldatafirstclass.Inns}</td>
                                            <td>${bowldatalistA.Inns}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Wickets</th>
                                            <td>${bowldataTest.Wkts}</td>
                                            <td>${bowldataODI.Wkts}</td>
                                            <td>${bowldataT20.Wkts}</td>
                                            <td>${bowldatafirstclass.Wkts}</td>
                                            <td>${bowldatalistA.Wkts}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Runs</th>
                                            <td>${bowldataTest.Runs}</td>
                                            <td>${bowldataODI.Runs}</td>
                                            <td>${bowldataT20.Runs}</td>
                                            <td>${bowldatafirstclass.Runs}</td>
                                            <td>${bowldatalistA.Runs}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Balls</th>
                                            <td>${bowldataTest.Balls}</td>
                                            <td>${bowldataODI.Balls}</td>
                                            <td>${bowldataT20.Balls}</td>
                                            <td>${bowldatafirstclass.Balls}</td>
                                            <td>${bowldatalistA.Balls}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Average</th>
                                            <td>${bowldataTest.Ave}</td>
                                            <td>${bowldataODI.Ave}</td>
                                            <td>${bowldataT20.Ave}</td>
                                            <td>${bowldatafirstclass.Ave}</td>
                                            <td>${bowldatalistA.Ave}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Economy</th>
                                            <td>${bowldataTest.Econ}</td>
                                            <td>${bowldataODI.Econ}</td>
                                            <td>${bowldataT20.Econ}</td>
                                            <td>${bowldatafirstclass.Econ}</td>
                                            <td>${bowldatalistA.Econ}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Strike Rate</th>
                                            <td>${bowldataTest.SR}</td>
                                            <td>${bowldataODI.SR}</td>
                                            <td>${bowldataT20.SR}</td>
                                            <td>${bowldatafirstclass.SR}</td>
                                            <td>${bowldatalistA.SR}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Five Wickets</th>
                                            <td>${bowldataTest["5w"]}</td>
                                            <td>${bowldataODI["5w"]}</td>
                                            <td>${bowldataT20["5w"]}</td>
                                            <td>${bowldatafirstclass["5w"]}</td>
                                            <td>${bowldatalistA["5w"]}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">Four Wickets</th>
                                            <td>${bowldataTest["4w"]}</td>
                                            <td>${bowldataODI["4w"]}</td>
                                            <td>${bowldataT20["4w"]}</td>
                                            <td>${bowldatafirstclass["4w"]}</td>
                                            <td>${bowldatalistA["4w"]}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">BBM</th>
                                            <td>${bowldataTest["BBM"]}</td>
                                            <td>${bowldataODI["BBM"]}</td>
                                            <td>${bowldataT20["BBM"]}</td>
                                            <td>${bowldatafirstclass["BBM"]}</td>
                                            <td>${bowldatalistA["BBM"]}</td>
                                        </tr>
                                        <tr>
                                        <th scope="row">BBI</th>
                                            <td>${bowldataTest["BBI"]}</td>
                                            <td>${bowldataODI["BBI"]}</td>
                                            <td>${bowldataT20["BBI"]}</td>
                                            <td>${bowldatafirstclass["BBI"]}</td>
                                            <td>${bowldatalistA["BBI"]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </ul>
                            
                        </div>
                        `)
                    });
                    console.log(pid);
                    //$('#formFill').hide();
                    //let player = await getPlayerDetails(pid);
                    //console.log(player);
                    // $('#playerInfo').append(`

                    // `)
                    //console.log($(ev.target).attr('data-components'));
                })
                console.log(batTeams);
                console.log(bowlTeams);
            })
        })
        
    })
})
