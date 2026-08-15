import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============= USER FUNCTIONS =============

async function addUser(email, password, name) {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
}

async function getUser(email) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            memberships: {
                include: {
                    team: true
                }
            }
        }
    })
    return user
}

async function getUserByGoogleId(googleId) {
    const user = await prisma.user.findUnique({
        where: { googleId }
    })
    return user
}

async function upsertGoogleUser({ googleId, email, name, avatar }) {
    const existingByGoogleId = await prisma.user.findUnique({
        where: { googleId }
    })

    if (existingByGoogleId) {
        const user = await prisma.user.update({
            where: { id: existingByGoogleId.id },
            data: { name, avatar, email }
        })
        return { id: user.id, email: user.email, name: user.name }
    }

    const existingByEmail = await prisma.user.findUnique({
        where: { email }
    })

    if (existingByEmail) {
        const user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: { googleId, name, avatar }
        })
        return { id: user.id, email: user.email, name: user.name }
    }

    const user = await prisma.user.create({
        data: { googleId, email, name, avatar }
    })

    return { id: user.id, email: user.email, name: user.name }
}

// ============= TEAM FUNCTIONS =============

async function createTeam(name, userId){
    const team = await prisma.team.create({
        data: {
            name,
            members: {
                create: {
                    userId,
                    role: "SUPERADMIN"
                }
            }
        },
        include: {
            members: true
        }
    })
    return team
}

async function addUserToTeam(user_email, teamId, role="BASIC"){
    const user_id = await getUser(user_email)
    const member = await prisma.teamMember.create({
        data: {
            userId: user_id.id,
            teamId,
            role
        }
    })
    return member
}

async function getTeamById(teamId){
    const team = await prisma.team.findUnique({
        where: {
            id: teamId
        },
        include: {
            members: {
                include: {
                    user: true
                }
            },
            tasks: {
                include: {
                    createdBy: true,
                    assignments: {
                        include: {
                            user: true
                        }
                    },
                    comments: true
                }
            }
        }
    })
    return team
}

async function getAllUserTeams(userId){
    const teams = await prisma.teamMember.findMany({
        where: {
            userId
        },
        include: {
            team: {
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    })
    return teams.map(t => t.team)
}

async function updateRoleFromTeam(userId, teamId, role) {
    const member = await prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId,
          teamId
        }
      },
      data: {
        role
      }
    })
  
    return member
  }



async function removeUserFromTeam(userId, teamId){
    const member = await prisma.teamMember.delete({
        where: {
            userId_teamId: {
                userId,
                teamId
            }
        }
    })
    return member
}
// ============= TASK FUNCTIONS (Team Tasks) =============

async function createTeamTask(
    title,
    description,
    priority_,
    dueDate,
    teamId,
    createdByUserId,
    assignedToUserIds = []
) {
    const priorityMap = {
        1: "HIGH",
        2: "MEDIUM",
        3: "LOW"
      };
      
    const priority = priorityMap[priority_];
    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: new Date(dueDate).toISOString(),
            teamId,
            createdByUserId,
            assignments: assignedToUserIds.length > 0 ? {
                create: assignedToUserIds.map(userId => ({
                    userId
                }))
            } : undefined
        },
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        }
    })
    return task
}

async function createPersonalTask(
    title,
    description,
    priority_,
    dueDate,
    createdByUserId,
) {
    const priorityMap = {
        1: "HIGH",
        2: "MEDIUM",
        3: "LOW"
    };
      
    const priority = priorityMap[priority_];
    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: new Date(dueDate).toISOString(),
            createdByUserId,
            assignments: {
                create: {
                    userId: createdByUserId
                }
            }
        },
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        }
    })
    return task
}

async function getFilteredTeamTasks(teamId, filters = {}) {
    const {
        status,           
        priority,
        assignedUserId,  
        dueDateFrom,     
        dueDateTo,       
        sortBy = 'createdAt',
        sortOrder = 'desc'    
    } = filters;

    const whereClause = {
        teamId
    };

    if (status) {
        whereClause.status = status;
    }

    if (priority) {
        whereClause.priority = priority;
    }

    if (assignedUserId) {
        whereClause.assignments = {
            some: {
                userId: assignedUserId
            }
        };
    }

    if (dueDateFrom || dueDateTo) {
        whereClause.dueDate = {};
        if (dueDateFrom) {
            whereClause.dueDate.gte = new Date(dueDateFrom);
        }
        if (dueDateTo) {
            whereClause.dueDate.lte = new Date(dueDateTo);
        }
    }

    const orderByClause = {};
    if (sortBy === 'dueDate') {
        orderByClause.dueDate = sortOrder;
    } else if (sortBy === 'priority') {
        orderByClause.priority = sortOrder;
    } else {
        orderByClause.createdAt = sortOrder;
    }

    const tasks = await prisma.task.findMany({
        where: whereClause,
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        },
        orderBy: orderByClause
    });

    return tasks;
}

async function getTasksByStatus(teamId, status) {
    const tasks = await prisma.task.findMany({
        where: {
            teamId,
            status
        },
        include: {
            createdBy: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        }
    })
    return tasks
}

async function getTeamTasks(teamId) {
    const tasks = await prisma.task.findMany({
        where: {
            teamId
        },
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return tasks
}

async function getUserAssignedTasks(userId) {
    const assignments = await prisma.taskAssignment.findMany({
      where: {
        userId,
        task: {
          teamId: null
        }
      },
      include: {
        task: {
          include: {
            team: true,
            createdBy: true,
            assignments: {
              include: {
                user: true
              }
            },
            comments: true
          }
        }
      }
    });
  
    return assignments.map(a => a.task);
  }

async function getTaskById(taskId) {
    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        }
    })
    return task
}

async function assignTaskToUser(taskId, userId) {
    const assignment = await prisma.taskAssignment.create({
        data: {
            taskId,
            userId
        },
        include: {
            user: true,
            task: true
        }
    })
    return assignment
}

async function unassignTaskFromUser(taskId, userId) {
    const assignment = await prisma.taskAssignment.delete({
        where: {
            taskId_userId: {
                taskId,
                userId
            }
        }
    })
    return assignment
}


async function updateTask(taskId, data) {
    const task = await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            ...data,
            updatedAt: new Date()
        },
        include: {
            createdBy: true,
            team: true,
            assignments: {
                include: {
                    user: true
                }
            },
            comments: true
        }
    })
    return task
}




async function deleteTask(taskId) {
    const task = await prisma.task.delete({
        where: {
            id: taskId
        }
    })
    return task
}

// ============= COMMENT FUNCTIONS =============

async function addComment(taskId, note) {
    const comment = await prisma.comment.create({
        data: {
            taskId,
            note
        }
    })
    return comment
}

async function getTaskComments(taskId) {
    const comments = await prisma.comment.findMany({
        where: {
            taskId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    return comments
}

async function deleteComment(commentId) {
    const comment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
    return comment
}

export {
    // User functions
    addUser,
    getUser,
    getUserById,
    getUserByGoogleId,
    upsertGoogleUser,
    createPersonalTask,
    
    // Team functions
    createTeam,
    addUserToTeam,
    removeUserFromTeam,
    updateRoleFromTeam,
    getTeamById,
    getAllUserTeams,
    
    // Task functions
    createTeamTask,
    assignTaskToUser,
    unassignTaskFromUser,
    getTeamTasks,
    getTasksByStatus,
    getUserAssignedTasks,
    getTaskById,
    updateTask,
    deleteTask,
    
    // Comment functions
    addComment,
    getTaskComments,
    deleteComment,
    getFilteredTeamTasks
};