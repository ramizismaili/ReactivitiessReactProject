using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Travelies
{
    public class UpdateAttendanceT
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
            _userAccessor = userAccessor;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var travel = await _context.Travelies
                .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (travel == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var hostUsername = travel.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = travel.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                travel.IsCancelled = !travel.IsCancelled;

                if(attendance != null && hostUsername != user.UserName)
                travel.Attendees.Remove(attendance);

                if (attendance == null)
                {
                    attendance = new TravelAttendee
                    {
                        AppUser = user,
                        Travel = travel,
                        IsHost = false
                    };

                    travel.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}