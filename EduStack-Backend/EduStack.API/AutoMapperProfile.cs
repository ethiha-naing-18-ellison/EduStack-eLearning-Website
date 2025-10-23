using AutoMapper;
using EduStack.Core.DTOs.Auth;
using EduStack.Core.Entities;

namespace EduStack.API;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User mappings
        CreateMap<User, UserResponseDto>();
    }
}
