export class ClientTeamUI {

    static makeTeamDiv(team, index) {
        const teamDiv = document.createElement('div');
        teamDiv.setAttribute('id', 'teamDiv_'+index);
        teamDiv.classList.add('container-col');

        const nameP = document.createElement('p');
        nameP.setAttribute('id', 'nameP_'+index);
        nameP.classList.add('shadow');
        nameP.innerText = team.getName();

        const div = document.createElement('div');
        div.classList.add('container-col');
        div.classList.add('shadow');

        const timerP = document.createElement('p');
        timerP.setAttribute('id', 'timerP_' + index);
        timerP.classList.add('slider');
        team.getTimer().setTimerP(timerP);
            
        const energyP = document.createElement('p');
        energyP.setAttribute('id', 'energyP_'+index);
            
        const scoreP = document.createElement('p');
        scoreP.setAttribute('id', 'scoreP_'+index);

        const div2 = document.createElement('div');
        div2.classList.add('container');

        div2.append(team.getSkillTreeUI());

        div.append(timerP);
        div.append(energyP);
        div.append(scoreP);
        div.append(div2);

        teamDiv.append(nameP);
        teamDiv.append(div);

        return teamDiv;
    }

    static refreshTeamDiv(team, index) {
        document.getElementById('energyP_'+index).innerText = `${team.getEnergy()}(+${team.getEarn()}) E`;
        document.getElementById('scoreP_'+index).innerText = `${team.getScore()}점`;
    }

}