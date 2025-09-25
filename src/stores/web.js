import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useWebStore = defineStore("web", () => {
    const web = reactive({
        title: "这是一个网站",
        url: "/url"
    })
    const users = ref(1000)
    const userAdd = () => {
        users.value++
        console.log(users.value);
        
    }
    return{
        web,
        users,
        userAdd
    }
})