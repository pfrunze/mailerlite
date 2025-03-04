<?php

use App\Http\Controllers\API\FieldController;
use App\Http\Controllers\API\SubscriberController;
use Illuminate\Support\Facades\Route;

Route::apiResource('subscribers', SubscriberController::class);
Route::apiResource('fields', FieldController::class);
