using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Travelies;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class EditT
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
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var travel = await _context.Travelies.FindAsync(request.Travel.Id);

                if(travel == null) return null;

                _mapper.Map(request.Travel, travel);

                var result = await _context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to update travel");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}