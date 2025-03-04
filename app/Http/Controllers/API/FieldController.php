<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\Fields\StoreFieldRequest;
use Domain\Fields\Actions\CreateFieldAction;
use Domain\Fields\DTOs\CreateFieldData;
use Domain\Fields\Models\Field;

class FieldController extends Controller
{
    public function index()
    {
        return response()->json(Field::all());
    }

    public function show(Field $field)
    {
        return response()->json($field);
    }

    public function store(StoreFieldRequest $request, CreateFieldAction $createField)
    {
        $dto = CreateFieldData::from($request->validated());
        $field = $createField($dto);

        return response()->json($field, 201);
    }

    public function destroy(Field $field)
    {
        $field->delete();

        return response()->json(null, 204);
    }
}
