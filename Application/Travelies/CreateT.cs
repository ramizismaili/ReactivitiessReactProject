using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Travelies;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
// name 
namespace Application.Activities
{
    public class CreateT
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Travel Travel { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Travel).SetValidator(new TravelValidator());
            }
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
                var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetUsername());

                var attendee = new TravelAttendee
                {
                    AppUser = user,
                    Travel = request.Travel,
                    IsHost = true
                };

                request.Travel.Attendees.Add(attendee);

                _context.Travelies.Add(request.Travel);

                var result = await _context.SaveChangesAsync() > 0;
                
                if(!result) return Result<Unit>.Failure("Failed to create travel");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}