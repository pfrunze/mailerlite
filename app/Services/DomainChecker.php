<?php

namespace App\Services;

class DomainChecker
{
    public function check($domain): bool
    {
        return checkdnsrr($domain, 'ANY');
    }
}
