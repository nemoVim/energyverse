import { Skills } from './skills.mjs';

export class SkillTreeUI {
    #learned = [0, 1, 2];
    #ableToLearn = [];

    static windSkillIndexMap = new Map([
        [0, [3]],
        [1, [6]],
        [2, [9, 10]],
        [3, [14, 20, 21]],
        [4, [26]],
        [5, [29, 30]],
    ]);

    static solarSkillIndexMap = new Map([
        [0, [4]],
        [1, [7]],
        [2, [11, 12]],
        [3, [15, 22, 23]],
        [4, [17, 18]],
        [5, [31, 32]],
    ]);

    static atomicSkillIndexMap = new Map([
        [0, [5]],
        [1, [13, 8]],
        [2, [16]],
        [3, [19, 24, 25]],
        [4, [27, 28]],
        [5, [33]],
        [6, [34]],
    ]);

    constructor() {
        this.#initUI();
        this.#initBtns();
    }

    #initBtns() {
        document.getElementById('skillBtn').addEventListener('click', function () {
            document.getElementById('skillDiv').classList.remove('hidden');
        });

        document.getElementById('windSkillBtn').addEventListener('click', function () {
            document.getElementById('windSkillTreeDiv').classList.toggle('hidden');
        });

        document.getElementById('solarSkillBtn').addEventListener('click', function () {
            document.getElementById('solarSkillTreeDiv').classList.toggle('hidden');
        });

        document.getElementById('atomicSkillBtn').addEventListener('click', function () {
            document.getElementById('atomicSkillTreeDiv').classList.toggle('hidden');
        });
    }

    #initUI() {
        const skillDiv = document.getElementById('skillDiv');

        const windSkillTreeDiv = this.#createSkillTreeDiv(SkillTreeUI.windSkillIndexMap);
        windSkillTreeDiv.setAttribute('id', 'windSkillTreeDiv');
        windSkillTreeDiv.classList.add('hidden');

        const solarSkillTreeDiv = this.#createSkillTreeDiv(SkillTreeUI.solarSkillIndexMap);
        solarSkillTreeDiv.setAttribute('id', 'solarSkillTreeDiv');
        solarSkillTreeDiv.classList.add('hidden');

        const atomicSkillTreeDiv = this.#createSkillTreeDiv(SkillTreeUI.atomicSkillIndexMap);
        atomicSkillTreeDiv.setAttribute('id', 'atomicSkillTreeDiv');
        atomicSkillTreeDiv.classList.add('hidden');

        skillDiv.append(windSkillTreeDiv);
        skillDiv.append(solarSkillTreeDiv);
        skillDiv.append(atomicSkillTreeDiv);
    }

    #createSkillTreeDiv(skillIndexMap) {
        const skillTreeDiv = document.createElement('div');
        for (let line of skillIndexMap.keys()) {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('lineDiv');
            skillTreeDiv.append(lineDiv);

            for (let index of skillIndexMap.get(line)) {
                lineDiv.append(this.#createSkillElement(index));
            }
        }

        return skillTreeDiv;
    }

    #createSkillElement(index) {
        const checkbox = this.#createCheckbox(index);
        const label = this.#createLabel(index);
        const skillDiv = this.#createSkillDiv(index);

        label.append(skillDiv);

        const skillElement = document.createElement('div');
        skillElement.setAttribute('id', 'skill_'+index);

        skillElement.append(checkbox);
        skillElement.append(label);

        return skillElement;
    }

    #createCheckbox(index) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkbox_' + index);
        checkbox.classList.add('hidden');

        const highSkills = Skills[index].getHighSkills();

        checkbox.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[id^=checkbox_]');
            const skillElements = document.querySelectorAll('div[id^=skill_]');
            const skillDescriptions = document.querySelectorAll('p[id^=skillDescription_]');

            for (let _checkbox of checkboxes) {
                if (_checkbox === checkbox) continue;
                _checkbox.checked = false;
            }

            for (let _skillElement of skillElements) {
                _skillElement.classList.remove('focusedSkill');
            }

            for (let _skillDescription of skillDescriptions) {
                _skillDescription.classList.add('hidden');
            }

            if(checkbox.checked) {
                document.getElementById('skillDescription_'+index).classList.remove('hidden');
                document.getElementById('skill_'+index).classList.add('focusedSkill');
                for (let serial of highSkills) {
                    document.getElementById('skill_'+serial).classList.add('focusedSkill');
                }
            } else {
                document.getElementById('skillDescription_'+index).classList.add('hidden');
            }
        });

        return checkbox;
    }

    #createLabel(index) {

        const label = document.createElement('label');
        label.setAttribute('for', 'checkbox_' + index);

        return label;
    }

    #createSkillDiv(index) {
        const skill = Skills[index];

        const skillDiv = document.createElement('div');
        skillDiv.setAttribute('id', 'skillDiv_'+index);
        skillDiv.classList.add('skillDiv');

        const skillTitle = document.createElement('p');
        skillTitle.setAttribute('id', 'skillTitle_'+index);
        skillTitle.innerText = skill.getName();

        const skillDescription = document.createElement('p');
        skillDescription.setAttribute('id', 'skillDescription_'+index);
        skillDescription.classList.add('hidden');
        skillDescription.innerText = skill.getDescription();

        skillDiv.append(skillTitle);
        skillDiv.append(skillDescription);

        return skillDiv;
    }
}
