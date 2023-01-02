import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user', 
  () => {
    const userID = ref('')
    const userName = ref('')

    function setUser(user: { userID: string; userName: string }) {
      userID.value = user.userID
      userName.value = user.userName
    }
    function getUser() {
      return { userID, userName }
    }

    return { userID, userName }
  }, 
  {
    persist: {
      storage: sessionStorage
    }
  }
)
