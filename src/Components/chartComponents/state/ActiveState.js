import { atom } from "recoil";

const activeState = atom({
    key: 'activeState',
    default: '',
})

export default activeState;