from functools import partial

import ultraclick as click


def named_parameter(self, duration_ms):
    return {'duration_ms': duration_ms}


def keyword_arguments(self, **kwargs):
    return kwargs


class PartialExample:
    @click.command()
    @click.option('--duration-ms', type=click.INT)
    def baseline(self, duration_ms=5000):
        return {'duration_ms': duration_ms}

    named = partial(named_parameter, duration_ms=5000)
    named = click.option('--duration-ms', type=click.INT)(named)
    named = click.command(name='named')(named)

    keywords = partial(keyword_arguments, duration_ms=5000)
    keywords = click.option('--duration-ms', type=click.INT)(keywords)
    keywords = click.command(name='keywords')(keywords)


if __name__ == '__main__':
    click.group_from_class(PartialExample)()
