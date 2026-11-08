from typing import Any


class PytestTestRunner:
    """Runs pytest to discover and run tests."""

    def __init__(
        self,
        verbosity: int = 1,
        failfast: bool = False,
        keepdb: bool = False,
        **kwargs: Any,
    ) -> None:
        self.verbosity = verbosity
        self.failfast = failfast
        self.keepdb = keepdb

    def run_tests(self, test_labels: list[str]) -> int:
        """Run pytest and return the exitcode.

        It translates some of Django's test command option to pytest's.
        """
        import pytest

        argv: list[str] = []
        if self.verbosity == 0:
            argv.append("--quiet")
        if self.verbosity == 2:
            argv.append("--verbose")
        if self.verbosity == 3:
            argv.append("-vv")
        if self.failfast:
            argv.append("--exitfirst")
        if self.keepdb:
            argv.append("--reuse-db")

        argv.extend(test_labels)
        return pytest.main(argv)
