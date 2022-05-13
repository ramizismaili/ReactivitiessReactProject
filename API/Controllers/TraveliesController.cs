using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class TraveliesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTravelies()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTravel(Guid id)
        {
            return HandleResult(await Mediator.Send(new DetailsT.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Travel travel)
        {
            return HandleResult(await Mediator.Send(new CreateT.Command {Travel = travel}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Travel travel)
        {
            travel.Id = id;
            return HandleResult(await Mediator.Send(new EditT.Command{Travel = travel}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new DeleteT.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]

        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}