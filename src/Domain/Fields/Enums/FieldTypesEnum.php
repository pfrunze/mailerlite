<?php

namespace Domain\Fields\Enums;

enum FieldTypesEnum: string
{
    case DATE = 'date';
    case NUMBER = 'number';
    case STRING = 'string';
    case BOOLEAN = 'boolean';
}
