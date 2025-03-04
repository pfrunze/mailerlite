<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\Subscribers\StoreSubscriberRequest;
use Domain\Subscribers\Actions\CreateSubscriberAction;
use Domain\Subscribers\Models\Subscriber;
use Domain\Subscribers\DTOs\CreateSubscriberData;

class SubscriberController extends Controller
{
    public function index()
    {
        $query = Subscriber::with('fields');

        if ($state = request('filter.state')) {
            $query->where('state', $state);
        }

        if ($sortBy = request('sort_by')) {
            $direction = request('sort_direction', 'asc');
            $query->orderBy($sortBy, $direction);
        }

        $perPage = request('per_page', 10);
        $subscribers = $query->paginate($perPage);

        return response()->json($subscribers);
    }

    public function store(StoreSubscriberRequest $request, CreateSubscriberAction $createSubscriber)
    {
        $dto = CreateSubscriberData::from($request);
        $subscriber = $createSubscriber($dto);

        return response()->json($subscriber->load('fields'), 201);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();
        return response()->json(null, 204);
    }
}