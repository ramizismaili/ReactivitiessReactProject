using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Travelies
{
    public class ListT
    {
        public class Query : IRequest<Result<List<TravelDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<TravelDto>>>
        {
            private readonly DataContext _context;
        private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
            _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<TravelDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var travelies = await _context.Travelies
                .ProjectTo<TravelDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                


                return Result<List<TravelDto>>.Success(travelies);
            }
        }
    }
}