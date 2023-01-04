import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user', 
  () => {
    const userID = ref('')
    const userName = ref('')
    const userAuth = ref('')

    function setUser(user: { userID: string; userName: string, userAuth: string }) {
      userID.value = user.userID
      userName.value = user.userName
      userAuth.value = user.userAuth
    }

    return { userID, userName, userAuth }
  }, 
  {
    persist: {
      storage: sessionStorage
    }
  }
)
