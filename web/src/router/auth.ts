import { useRouter, type Router } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';
import type { Store, _UnwrapAll } from 'pinia';
import type { Ref } from 'vue';
import router from '.';

function isAuthenticated() {
    const user = useUserStore()
    // const userID = user.$state.userID
    axios({
        method: 'post',
        url: getAPI('/user/query_usr_info'),
        data: {
            account: user.$state.userID
        }
    }).then((res: { status: number; data: { usrList: any[], msg: string; }; }) => {
        if(res.status == 200) {
            const userData = res.data.usrList[0]
            user.$state.userID = userData.usr_account
            user.$state.userName = userData.usr_name
            console.log(user.$state.userID)
        }
    }).catch((error) => {
        user.$state.userID = ''
        const msg = error.response.data.msg;
        ElMessage.error(msg);
        router.push('/login')
    })
}

function queryUserInfo(user: Store<"user", _UnwrapAll<Pick<{ userID: Ref<string>; userName: Ref<string>; }, "userID" | "userName">>, Pick<{ userID: Ref<string>; userName: Ref<string>; }, never>, Pick<{ userID: Ref<string>; userName: Ref<string>; }, never>>) {
    return axios({
        method: 'post',
        url: getAPI('/user/query_usr_info'),
        data: {
            account: user.$state.userID
        }
    }).then((res: { status: number; data: { usrList: any[], msg: string; }; }) => {
        if(res.status == 200) {
            const userData = res.data.usrList[0]
            user.$state.userID = userData.usr_account
            user.$state.userName = userData.usr_name
            console.log(user.$state.userID)
        }
  }).catch((error) => {
    user.$state.userID = ''
    const msg = error.response.data.msg;
    ElMessage.error(msg);
    router.push('/login')
  })
}

export {
    isAuthenticated
}