<?php

namespace Domain\Subscribers\Enums;

enum SubscriberStatesEnum: string
{
    case ACTIVE = 'active';
    case UNSUBSCRIBED = 'unsubscribed';
    case JUNK = 'junk';
    case BOUNCED = 'bounced';
    case UNCONFIRMED = 'unconfirmed';
}
