interface LeaveBalanceFromDB {
    leaveType: { title: string, _id:string };
    allocated: number;
    taken: number;
}

export interface LeaveBalance {
    [key: string]: {
        id: string;
        allocated: number;
        taken: number;
    };
}

export const formateLeaveBalance = (data: LeaveBalanceFromDB[] ): LeaveBalance => {
    if(data == null)return {}
    return data?.reduce<LeaveBalance>((acc, d) => {
        acc[d.leaveType.title] = {
            id:d.leaveType._id,
            allocated: d.allocated,
            taken: d.taken
        };
        return acc;
    }, {});
};
