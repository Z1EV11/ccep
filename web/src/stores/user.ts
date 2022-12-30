import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const id = ref('')
  const name = ref('')
  function setUser(user: { userID: string; userName: string }) {
    id.value = user.userID
    name.value = user.userName
  }
  function getUser() {
    return { id, name }
  }

  return { setUser, getUser }
})
