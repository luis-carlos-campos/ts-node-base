interface Runnable {
    beforeRun?: void;
    run(): Promise<unknown>;
    afterRun?: void;
}

export default Runnable;
