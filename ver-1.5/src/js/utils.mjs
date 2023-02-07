export class Utils {
    static getImgElement(name) {
        let img = document.createElement('img');
        img.setAttribute('src', '/src/img/' + name + '.png');
        img.setAttribute('id', name);
        return img;
    }

    static makeMapArray(mapSize) {
        let mapArray;
        mapArray = new Array(2 * mapSize - 1);
    
        for (let i = 0; i < mapSize - 1; i++) {
            mapArray[i] = new Array(mapSize + i);
            mapArray[2 * mapSize - 2 - i] = new Array(mapSize + i);
        }
        mapArray[mapSize - 1] = new Array(2 * mapSize - 1);

        return mapArray;
    }

    static hideElement(id) {
        document.getElementById(id).classList.add('hidden');
    }

    static showElement(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    static addHidden(element) {
        element.classList.add('hidden');
    }
    
    static removeHidden(element) {
        element.classList.remove('hidden');
    }
}