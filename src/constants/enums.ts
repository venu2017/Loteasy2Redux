 enum typeOfProcess{
    funch,
    plan,
    catchup,
    orderfood
}

 enum typeOfAction{
    get,
    set
}

 enum typeOfHttpRequest{
    get,
    post,
    put,
    delete
}

 enum typeOfParams{
    navParams,
    localStorage
}

enum tabs{
    home,
    invites,
    memories,
    events,
    more
}

enum pages{
    home,
    chooseDateTimeLocation,
    chooseInvitees,
    chooseRestaurant,
    inviteSummary,
    inviteStatus,
    invites,
    memories,
    memoriesDetails,
    memoriesShare,
    memoriesSlide,
    memoriesUpload,
    more,
    myprofile,
    mybuddies,
    mypreferences,
    events,
    login,
    restaurantDetails,
    restaurantSearch,
    editLocation,


}

let  leEnums = {
    typeOfProcess,
    typeOfAction,
    typeOfHttpRequest,
    typeOfParams,
    pages,
    tabs
}

export default leEnums;

