import { GameTeam } from '../../room/src/js/gameTeam.mjs';
import { Skills } from './skills.mjs';
import { Utils } from './utils.mjs';

export class SkillTree {

    static defaultSkillIndexMap = new Map([
        [0, [0, 1, 2]]
    ]);

    static windSkillIndexMap = new Map([
        [0, [3]],
        [1, [6]],
        [2, [11, 12]],
        [3, []],
        [4, [14]],
        [5, [17, 18, 19]],
        [6, [27]],
        [7, []],
        [8, [30]],
    ]);

    static solarSkillIndexMap = new Map([
        [0, [4]],
        [1, [7, 8]],
        [2, [13]],
        [3, []],
        [4, [15]],
        [5, [20, 21, 22, 23]],
        [6, []],
        [7, [31]],
    ]);

    static atomicSkillIndexMap = new Map([
        [0, [5]],
        [1, [9, 10]],
        [2, []],
        [3, [16]],
        [4, [24, 25, 26]],
        [5, [28, 29]],
        [6, []],
        [7, [32]],
        [8, [33]],
    ]);

    #researchable = new Set([3, 4, 5]);

    #index;
    #team;

    #skillTreeUI;
    #skillBtnDiv;
    #skillTreeDiv;
    #defaultSkillTreeDiv;
    #windSkillTreeDiv;
    #solarSkillTreeDiv;
    #atomicSkillTreeDiv;

    constructor(_index, _team = null) {
        this.#index = _index;
        this.#team = _team;
        this.#initUI();
        this.#initBtns();
    }

    getUI() {
        return this.#skillTreeUI;
    }

    initDone() {
        this.learn(0);
        this.learn(1);
        this.learn(2);
    }

    #initBtns() {
        const skillBtn = document.createElement('button');
        skillBtn.setAttribute('id', 'skillBtn_' + this.#index);
        skillBtn.innerText = '기술트리';

        skillBtn.addEventListener('click', () => {
            this.#skillBtnDiv.classList.remove('hidden');
        });

        this.#skillTreeUI.prepend(skillBtn);

        const defaultSkillBtn = document.createElement('button');
        defaultSkillBtn.setAttribute('id', 'defaultSkillBtn_' + this.#index);
        defaultSkillBtn.innerText = '기본 기술';
        defaultSkillBtn.addEventListener('click', () => {
            this.#skillTreeDiv.classList.remove('hidden');
            this.#defaultSkillTreeDiv.classList.remove('hidden');
        });

        const windSkillBtn = document.createElement('button');
        windSkillBtn.setAttribute('id', 'windSkillBtn_' + this.#index);
        windSkillBtn.innerText = '풍력 기술트리';
        windSkillBtn.addEventListener('click', () => {
            this.#skillTreeDiv.classList.remove('hidden');
            this.#windSkillTreeDiv.classList.remove('hidden');
        });

        const solarSkillBtn = document.createElement('button');
        solarSkillBtn.setAttribute('id', 'solarSkillBtn_' + this.#index);
        solarSkillBtn.innerText = '태양광 스킬트리';
        solarSkillBtn.addEventListener('click', () => {
            this.#skillTreeDiv.classList.remove('hidden');
            this.#solarSkillTreeDiv.classList.remove('hidden');
        });

        const atomicSkillBtn = document.createElement('button');
        atomicSkillBtn.setAttribute('id', 'atomicSkillBtn_' + this.#index);
        atomicSkillBtn.innerText = '원자력 스킬트리';
        atomicSkillBtn.addEventListener('click', () => {
            this.#skillTreeDiv.classList.remove('hidden');
            this.#atomicSkillTreeDiv.classList.remove('hidden');
        });

        this.#skillBtnDiv.append(defaultSkillBtn);
        this.#skillBtnDiv.append(windSkillBtn);
        this.#skillBtnDiv.append(solarSkillBtn);
        this.#skillBtnDiv.append(atomicSkillBtn);

    }

    #initUI() {
        const skillTreeUI = document.createElement('div');
        skillTreeUI.setAttribute('id', 'skillTreeUI_' + this.#index);
        this.#skillTreeUI = skillTreeUI;

        const skillBtnDiv = document.createElement('div');
        skillBtnDiv.setAttribute('id', 'skillBtnDiv_' + this.#index);
        skillBtnDiv.classList.add('hidden');
        skillBtnDiv.classList.add('back');
        this.#skillBtnDiv = skillBtnDiv;

        const skillTreeDiv = document.createElement('div');
        skillTreeDiv.setAttribute('id', 'skillTreeDiv_' + this.#index);
        skillTreeDiv.classList.add('hidden');
        skillTreeDiv.classList.add('back');
        this.#skillTreeDiv = skillTreeDiv;

        const defaultSkillTreeDiv = this.#createSkillTreeDiv(
            SkillTree.defaultSkillIndexMap
        );
        defaultSkillTreeDiv.setAttribute('id', 'defaultSkillTreeDiv_' + this.#index);
        defaultSkillTreeDiv.classList.add('hidden');
        // defaultSkillTreeDiv.classList.add('back');
        this.#defaultSkillTreeDiv = defaultSkillTreeDiv;

        const windSkillTreeDiv = this.#createSkillTreeDiv(
            SkillTree.windSkillIndexMap
        );
        windSkillTreeDiv.setAttribute('id', 'windSkillTreeDiv_' + this.#index);
        windSkillTreeDiv.classList.add('hidden');
        // windSkillTreeDiv.classList.add('back');
        this.#windSkillTreeDiv = windSkillTreeDiv;

        const solarSkillTreeDiv = this.#createSkillTreeDiv(
            SkillTree.solarSkillIndexMap
        );
        solarSkillTreeDiv.setAttribute(
            'id',
            'solarSkillTreeDiv_' + this.#index
        );
        solarSkillTreeDiv.classList.add('hidden');
        // solarSkillTreeDiv.classList.add('back');
        this.#solarSkillTreeDiv = solarSkillTreeDiv;

        const atomicSkillTreeDiv = this.#createSkillTreeDiv(
            SkillTree.atomicSkillIndexMap
        );
        atomicSkillTreeDiv.setAttribute(
            'id',
            'atomicSkillTreeDiv_' + this.#index
        );
        atomicSkillTreeDiv.classList.add('hidden');
        // atomicSkillTreeDiv.classList.add('back');
        this.#atomicSkillTreeDiv = atomicSkillTreeDiv;

        skillTreeUI.append(skillBtnDiv);
        skillTreeUI.append(skillTreeDiv);
        skillTreeDiv.append(defaultSkillTreeDiv);
        skillTreeDiv.append(windSkillTreeDiv);
        skillTreeDiv.append(solarSkillTreeDiv);
        skillTreeDiv.append(atomicSkillTreeDiv);

        // -----------------------------

        skillTreeDiv.addEventListener('click', (e) => {
            if (
                e.target.id.search(/skillTreeDiv_/) === -1 &&
                !e.target.classList.contains('lineDiv')
            )
                return;
            skillTreeDiv.classList.add('hidden');
            defaultSkillTreeDiv.classList.add('hidden');
            windSkillTreeDiv.classList.add('hidden');
            solarSkillTreeDiv.classList.add('hidden');
            atomicSkillTreeDiv.classList.add('hidden');
        });

        skillBtnDiv.addEventListener('click', (e) => {
            if (e.target.id.search(/skillBtnDiv_/) === -1) return;
            skillBtnDiv.classList.add('hidden');
        });
    }

    #createSkillTreeDiv(skillIndexMap) {
        const skillTreeDiv = document.createElement('div');
        for (let line of skillIndexMap.keys()) {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('lineDiv');
            skillTreeDiv.append(lineDiv);

            if (skillIndexMap.get(line).length === 0) {
                lineDiv.append(document.createElement('hr'));
            } else {
                for (let index of skillIndexMap.get(line)) {
                    lineDiv.append(this.#createSkillElement(index));
                }
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
        skillElement.setAttribute('id', this.#makeId('skill', index));

        skillElement.append(checkbox);
        skillElement.append(label);

        return skillElement;
    }

    #createCheckbox(index) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', this.#makeId('checkbox', index));
        checkbox.classList.add('hidden');

        const highSkills = Skills[index].getHighSkills();

        checkbox.addEventListener('click', (e) => {
            const checkboxes = document.querySelectorAll(
                `input[id^=${this.#makeId('checkbox', null)}]`
            );
            const skillDivs = document.getElementsByClassName('skillDiv');
            const skillDescriptions = document.querySelectorAll(
                `p[id^=${this.#makeId('skillDescription', null)}]`
            );

            for (let _checkbox of checkboxes) {
                if (_checkbox === checkbox) continue;
                _checkbox.checked = false;
            }

            for (let _skillDiv of skillDivs) {
                _skillDiv.classList.remove('focused');
            }

            for (let _skillDescription of skillDescriptions) {
                _skillDescription.classList.add('hidden');
            }

            if (checkbox.checked) {
                document
                    .getElementById(this.#makeId('skillDescription', index))
                    .classList.remove('hidden');
                document
                    .getElementById(this.#makeId('skillDiv', index))
                    .classList.add('focused');
                for (let serial of highSkills) {
                    document
                        .getElementById(this.#makeId('skillDiv', serial))
                        .classList.add('focused');
                }
            } else if (!checkbox.checked && this.#team.getResearching().has(index)) {
                let isRemovable = true;
                this.#team.getResearching().forEach(_index => {
                    if (Skills[_index].getHighSkills().indexOf(index) != -1) {
                        isRemovable = false;
                    }
                });

                if (isRemovable) {
                    if (this.#team instanceof GameTeam) {
                        this.#team.unResearch(index);
                    } else if (this.#team.getSocket() !== null) {
                        this.#team.getSocket().emit('unResearchClient', [index, this.#index]);
                    }
                } else if (this.#team instanceof GameTeam || this.#team.getSocket() !== null) {
                    alert('하위 기술이 연구중입니다!');
                    e.preventDefault();
                }

            } else if (!checkbox.checked && this.#researchable.has(index) && (this.#team.getEnergy() >= Skills[index].getCost())) {
                if (this.#team.getResearching().size < 2) {
                    if (this.#team instanceof GameTeam) {
                        this.#team.research(index);
                    } else if (this.#team.getSocket() !== null) {
                        this.#team.getSocket().emit('researchClient', [index, this.#index]);
                    }
                } else if (this.#team instanceof GameTeam || this.#team.getSocket() !== null) {
                    alert('한 턴에 두 개 이상 연구할 수 없습니다!');
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
            }
        });

        return checkbox;
    }

    #createLabel(index) {
        const label = document.createElement('label');
        label.setAttribute('for', this.#makeId('checkbox', index));

        return label;
    }

    #createSkillDiv(index) {
        const skill = Skills[index];

        const skillDiv = document.createElement('div');
        skillDiv.setAttribute('id', this.#makeId('skillDiv', index));
        skillDiv.classList.add('skillDiv');

        if (this.#researchable.has(index)) {
            skillDiv.classList.add('researchable');
        }

        const skillTitle = document.createElement('p');
        skillTitle.setAttribute('id', this.#makeId('skillTitle', index));
        skillTitle.innerText = skill.getName();

        const skillDescription = document.createElement('p');
        skillDescription.setAttribute(
            'id',
            this.#makeId('skillDescription', index)
        );
        skillDescription.classList.add('hidden');
        skillDescription.innerText = skill.getDescription();

        skillDiv.append(skillTitle);
        skillDiv.append(skillDescription);

        return skillDiv;
    }

    #makeId(kind, index) {
        if (index === null) {
            return `${kind}_${this.#index}_`;
        } else {
            return `${kind}_${this.#index}_${index}`;
        }
    }

    setResearchable() {
        this.#researchable.clear();

        Array.from(document.getElementsByClassName('researchable')).forEach(element => {
            if (element.id.search(this.#makeId('skillDiv', null)) !== -1) {
                element.classList.remove('researchable');
            }
        });

        Skills.forEach((skill) => {
            if (this.#team.getLearned().has(skill.getSerial())) return;
            if (this.#team.getResearching().has(skill.getSerial())) return;

            let isResearchable = true;
            skill.getHighSkills().forEach((highIndex) => {
                if (
                    this.#team.getResearching().has(highIndex) ||
                    this.#team.getLearned().has(highIndex)
                )
                    return;

                isResearchable = false;
            });

            if (isResearchable) {
                this.#researchable.add(skill.getSerial());
                document
                    .getElementById(this.#makeId('skillDiv', skill.getSerial()))
                    .classList.add('researchable');
            }
        });

        console.log('--researchable--');
        console.log(this.#researchable);
    }

    research(index) {
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.remove('researchable');
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.add('researching');

        this.setResearchable();
    }

    unResearch(index) {
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.add('researchable');
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.remove('researching');

        this.setResearchable();
    }

    learn(index) {
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.remove('researching');
        document
            .getElementById(this.#makeId('skillDiv', index))
            .classList.add('learned');

        this.setResearchable();
    }
}
