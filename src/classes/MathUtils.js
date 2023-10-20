export default class MathUtils {

    static randRange (min, max) { // inclusive of min and max 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}