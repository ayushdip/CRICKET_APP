$(()=>{
    $('#spinner').show();
    let matchD = {};
    let matchS = {};
    function getMatchDetails(match_id){
        return new Promise((resolve,reject)=>{
            if(matchD[match_id]){
                resolve(matchD[match_id]);
            }
            else{
                $.get(`https://cricapi.com/api/fantasySummary?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2&unique_id=${match_id}`,(data)=>{
                    matchD[match_id] = data;
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
    $.get('https://cricapi.com/api/matches?apikey=r54bkFuzPIa7WSQl2Ecm6VNQ8AH2',async(Data)=>{
        //console.log(data.matches);
        for(match of Data.matches){
            if(match.winner_team){
                let matchDetails = await getMatchDetails(match.unique_id);
                let matchScore = await getMatchScore(match.unique_id);
                console.log(matchScore);
                let team1 = matchScore["team-1"];
                let team2 = matchScore["team-2"];
                let winner_team = matchDetails.data.winner_team
                let curr_score = matchScore.description? matchScore.description.split('v'):["N/A","N/A"];
                let team1_score = curr_score[0] 
                let team2_score = curr_score[1]
                console.log(matchDetails);
                console.log(matchScore.matchStarted);
                if(matchScore.matchStarted==true && team1_score!="N/A"){
                    $('#matchList').append(`
                        <div class="card shadow p-4 m-4 col-md-12"  >
                            <div class="card-header bg-transparent text-danger">${team1} vs ${team2}</div>
                            <div class="card-header bg-transparent text-primary">${team1_score}<br>${team2_score}</div>
                            <div class="card-header bg-transparent text-success">${match.winner_team} won the match</div>
                            <button class="btn btn-primary" data-components="${match.unique_id}">View details</button>
                        </div>
                    `)
                }
            }
        }
        $('#spinner').hide();
        $('.btn').click((ev)=>{
            let unique_id = $(ev.target).attr('data-components');
            console.log(unique_id);
            $('#content').load('/components/matchScore.html',async()=>{
                let matchDetails = await getMatchDetails(unique_id);
                let matchScore = await getMatchScore(unique_id);
                let team1 = matchScore["team-1"];
                let team2 = matchScore["team-2"];
                let winner_team = matchDetails.data.winner_team;
                let curr_score = matchScore.description.split('v');
                let team1_score = curr_score[0] 
                let team2_score = curr_score[1];
                let teams = matchDetails.data.team;
                let score = matchDetails.data;
                let batTeams = score.batting;
                let bowlTeams = score.bowling;
                $('#head').text(`${team1} vs ${team2}`);
                let i=0;
                $('#teamScores').append(`
                    <div class="card shadow mx-auto p-4 col-md-6"  >
                        <div class="card-header bg-transparent text-danger">${team1} vs ${team2}</div>
                        <div class="card-header bg-transparent text-primary">${team1_score}<br>${team2_score}</div>
                        <div class="card-header bg-transparent text-success">${winner_team} won the match</div>
                    </div>
                `)
                for(team of batTeams){
                    $('#scoreList').append(`<li class="list-group-item text-center bg-dark" style="color:white;">${team.title}</li>`)
                    $('#scoreList').append(`
                    <table class="table table-responsive-md table-hover">
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
                            <td class="playerPID" data-components="${batsman.pid}">${batsman.batsman}</td>
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
                            <td class="playerPID" data-components="${bowler.pid}">${bowler.bowler}</td>
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
                
                console.log(batTeams);
                console.log(bowlTeams);
            })
        })
    })
    
})
