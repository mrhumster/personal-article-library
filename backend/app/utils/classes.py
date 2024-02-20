from datetime import datetime, timezone
from typing import Annotated

from pydantic import BeforeValidator, PlainSerializer

from utils.environment import DT_FORMAT

CustomDatetime = Annotated[
    datetime,
    BeforeValidator(lambda x: datetime.strptime(x, '%Y-%m-%dT%H:%M:%S.%fZ').astimezone(tz=timezone.utc)),
    PlainSerializer(lambda x: x.strftime(DT_FORMAT))
]