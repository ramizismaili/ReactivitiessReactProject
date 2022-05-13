using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Travelies;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Travelies
{
    public class DetailsT
    {
        public class Query : IRequest<Result<TravelDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TravelDto>>
        {
            private readonly DataContext _context;
        private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
            _mapper = mapper;
                _context = context;
            }

            public async Task<Result<TravelDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var travel = await _context.Travelies
                .ProjectTo<TravelDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<TravelDto>.Success(travel);
            }
        }
    }
}