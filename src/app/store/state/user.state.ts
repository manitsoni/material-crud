
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Posts } from 'src/app/crud/get-data/get-data.component';
import { Injectable } from '@angular/core';
import { GetUsers } from '../action/user.action';
import { CommanService } from 'src/app/comman.service';
import { tap } from 'rxjs/operators'

enum PageData {
    URL1 = "http://localhost:3000/posts",
    COUNTRY_URL = "https://api.first.org/data/v1/countries"
}
export class UserStateModel {
    users: any;
    lodedUser: boolean = false
}

@State<UserStateModel>({
    name: 'users',
    defaults: {
        users: [],
        lodedUser: false
    }
})
@Injectable()
export class UserState {
    constructor(private cs: CommanService) { }
    @Selector()
    static getUsers(state: UserStateModel) {
        return state.users;
    }
    @Selector()
    static getLoadedUsers(state: UserStateModel):boolean {
        return state.lodedUser;
    }
    @Action(GetUsers)
    getUserList({ getState, setState }: StateContext<UserStateModel>) {
        return this.cs.getData(PageData.URL1).pipe(tap((res: any) => {
            const state = getState();
            setState({
                ...state,
                users: res,
                lodedUser: true
            })
        }))
    }
}