import axiosInstance from "../Interceptor/AxiosInterceptor";

const createMentor = async (mentor: any) => {
    return axiosInstance.post(`/mentors/create`, mentor)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const updateMentor = async (mentor: any) => {
    return axiosInstance.put(`/mentors/update`, mentor)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentor = async (id: any) => {
    return axiosInstance.get(`/mentors/get/${id}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorByEmail = async (email: string) => {
    return axiosInstance.get(`/mentors/getByEmail/${email}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getAllMentors = async () => {
    return axiosInstance.get(`/mentors/getAll`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getAvailableMentors = async () => {
    return axiosInstance.get(`/mentors/available`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsByStatus = async (status: string) => {
    return axiosInstance.get(`/mentors/status/${status}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsByExpertise = async (expertise: string) => {
    return axiosInstance.get(`/mentors/expertise/${expertise}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsBySkill = async (skill: string) => {
    return axiosInstance.get(`/mentors/skill/${skill}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsByLocation = async (location: string) => {
    return axiosInstance.get(`/mentors/location/${location}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsWithCapacity = async () => {
    return axiosInstance.get(`/mentors/withCapacity`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const getMentorsByRateRange = async (minRate: number, maxRate: number) => {
    return axiosInstance.get(`/mentors/rateRange?minRate=${minRate}&maxRate=${maxRate}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const updateMentorAvailability = async (id: any, isAvailable: boolean) => {
    return axiosInstance.put(`/mentors/availability/${id}?isAvailable=${isAvailable}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const updateMentorStatus = async (id: any, status: string) => {
    return axiosInstance.put(`/mentors/status/${id}?status=${status}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const assignMentee = async (mentorId: any) => {
    return axiosInstance.post(`/mentors/assignMentee/${mentorId}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const removeMentee = async (mentorId: any) => {
    return axiosInstance.post(`/mentors/removeMentee/${mentorId}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const requestMentorshipSession = async (mentorId: any, requestData: any) => {
    return axiosInstance.post(`/mentors/requestSession/${mentorId}`, requestData)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const updateMentorshipRequestStatus = async (mentorId: any, requestId: any, status: string, scheduledTime?: string) => {
    const params = new URLSearchParams({ status });
    if (scheduledTime) params.append('scheduledTime', scheduledTime);
    return axiosInstance.put(`/mentors/updateRequestStatus/${mentorId}/${requestId}?${params}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

const deleteMentor = async (id: any) => {
    return axiosInstance.delete(`/mentors/delete/${id}`)
    .then(result => result.data)
    .catch(error => {throw error;});
}

export {
    createMentor,
    updateMentor,
    getMentor,
    getMentorByEmail,
    getAllMentors,
    getAvailableMentors,
    getMentorsByStatus,
    getMentorsByExpertise,
    getMentorsBySkill,
    getMentorsByLocation,
    getMentorsWithCapacity,
    getMentorsByRateRange,
    updateMentorAvailability,
    updateMentorStatus,
    assignMentee,
    removeMentee,
    requestMentorshipSession,
    updateMentorshipRequestStatus,
    deleteMentor
};