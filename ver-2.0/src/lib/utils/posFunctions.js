export function getPositionStyle(pos, type = 'normal') {
    return `left:${(pos[0]) * 2.7}rem; top:${
        ((pos[1] - pos[2]) * 0.92) * 3 ** (1 / 2) - 0.8
    }rem`;
}
